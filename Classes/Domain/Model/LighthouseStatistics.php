<?php
declare(strict_types=1);

namespace Stackfactory\SfSeolighthouse\Domain\Model;


/**
 *
 * This file is part of the "SEO Lighthouse Score" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2021 Andreas Kauhold <info@stackfactory.de>, Stackfactory
 */

/**
 * LighthouseStatistics
 */
class LighthouseStatistics extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
{
    /**
     * Target Page ID
     * 
     * @var int
     */
    protected $target = 0;

    /**
     * First Contentful Paint
     * 
     * @var float
     */
    protected $fcp = 0.0;

    /**
     * Speed Index
     * 
     * @var float
     */
    protected $si = 0.0;

    /**
     * Largest Contentful Paint
     * 
     * @var float
     */
    protected $lcp = 0.0;

    /**
     * Time to Interactive
     * 
     * @var float
     */
    protected $tti = 0.0;

    /**
     * Total Blocking Time
     * 
     * @var float
     */
    protected $tbt = 0.0;

    /**
     * Cumulative Layout Shift
     * 
     * @var float
     */
    protected $cls = 0.0;

    /**
     * Device 
     * 
     * @var string
     */
    protected $device = '';

    /**
     * Returns the target
     * 
     * @return int $target
     */
    public function getTarget()
    {
        return $this->target;
    }

    /**
     * Sets the target
     * 
     * @param int $target
     * @return void
     */
    public function setTarget($target)
    {
        $this->target = $target;
    }

    /**
     * Returns the fcp
     * 
     * @return float $fcp
     */
    public function getFcp()
    {
        return $this->fcp;
    }

    /**
     * Sets the fcp
     * 
     * @param float $fcp
     * @return void
     */
    public function setFcp($fcp)
    {
        $this->fcp = $fcp;
    }

    /**
     * Returns the si
     * 
     * @return float $si
     */
    public function getSi()
    {
        return $this->si;
    }

    /**
     * Sets the si
     * 
     * @param float $si
     * @return void
     */
    public function setSi($si)
    {
        $this->si = $si;
    }

    /**
     * Returns the lcp
     * 
     * @return float $lcp
     */
    public function getLcp()
    {
        return $this->lcp;
    }

    /**
     * Sets the lcp
     * 
     * @param float $lcp
     * @return void
     */
    public function setLcp($lcp)
    {
        $this->lcp = $lcp;
    }

    /**
     * Returns the tti
     * 
     * @return float $tti
     */
    public function getTti()
    {
        return $this->tti;
    }

    /**
     * Sets the tti
     * 
     * @param float $tti
     * @return void
     */
    public function setTti($tti)
    {
        $this->tti = $tti;
    }

    /**
     * Returns the tbt
     * 
     * @return float $tbt
     */
    public function getTbt()
    {
        return $this->tbt;
    }

    /**
     * Sets the tbt
     * 
     * @param float $tbt
     * @return void
     */
    public function setTbt($tbt)
    {
        $this->tbt = $tbt;
    }

    /**
     * Returns the cls
     * 
     * @return float $cls
     */
    public function getCls()
    {
        return $this->cls;
    }

    /**
     * Sets the cls
     * 
     * @param float $cls
     * @return void
     */
    public function setCls($cls)
    {
        $this->cls = $cls;
    }

    /**
     * Returns the device
     * 
     * @return string $device
     */
    public function getDevice()
    {
        return $this->device;
    }

    /**
     * Sets the device
     * 
     * @param string $device
     * @return void
     */
    public function setDevice($device)
    {
        $this->device = $device;
    }
}
